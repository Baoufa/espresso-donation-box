import { ChangeEvent, useState } from "react";
import { useAccount } from "../useAccount";
import useContract from "../useContract";
import { formatEther, parseEther } from "viem";

export default function useForm() {
  const [userInput, setUserInput] = useState("");
  const { balance } = useAccount();
  const { feeData, donateGasCost, donate } = useContract();
  const [error, setError] = useState<Error | null>(null);
  const [value, setValue] = useState<bigint | null>();

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setValue(null);
    setError(null);

    if (!e.target.value) {
      setUserInput("");
      return;
    }
    setUserInput(e.target.value);
  }

  function getMaxValue(): bigint | null {
    try {
      if (!feeData || !feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas)
        throw new Error("Fee data not available");
      const totalFee = feeData.maxFeePerGas + feeData.maxPriorityFeePerGas;
      const maxValue = BigInt(balance || 0) - donateGasCost * totalFee;
      return maxValue > BigInt(0) ? maxValue : BigInt(0);
    } catch (_) {
      return null;
    }
  }

  function validate() {
    try {
      const inputAsNumber = Number(userInput);
      const inputAsBigInt = parseEther(userInput);

      if (!inputAsNumber) {
        setError(new Error("Please enter a value"));
        setValue(null);
        return;
      }
      if (inputAsNumber <= 0) {
        setError(new Error("Please enter a value greater than 0"));
        setValue(null);
        return;
      }

      const maxValue = getMaxValue();
      if (maxValue === BigInt(0)) {
        setError(new Error("You don't have ETH, please use a sepolia faucet"));
        setValue(null);
        return;
      }

      if (maxValue && inputAsBigInt > maxValue) {
        setError(
          new Error(
            `Insufficient balance max ${parseFloat(
              formatEther(maxValue)
            ).toFixed(4)} ETH`
          )
        );
        setValue(null);
        return;
      }

      // Finally, if the value is valid, set the value
      if (inputAsBigInt) {
        setError(null);
        setValue(inputAsBigInt);
        return;
      }
    } catch (e) {
      setError(new Error("Please enter a valid value"));
      setValue(null);
      return;
    }
  }

  function submit() {
    validate();
    if (!error && value) donate(value);
  }

  return {
    userInput,
    error,
    value,
    onChange,
    validate,
    submit,
  };
}
