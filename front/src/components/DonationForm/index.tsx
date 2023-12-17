"use client";

import classes from "./styles.module.css";
import { useEffect, useState } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useChainId, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CHAIN_ID } from "@/constants";
import { useAccount } from "@/hooks/useAccount";
import useForm from "@/hooks/useForm";
import useContract from "@/hooks/useContract";
import Button from "../Button";
import Input from "../Input";
import Title from "../Title";
import Loader from "../Loader";

enum Step {
  Connect,
  Donate,
  Switch,
  Confirm,
  Loading,
  Success,
  Error,
}

export default function Form() {
  const [step, setStep] = useState<Step>(Step.Connect);
  const { value, userInput, error, onChange, validate } = useForm();
  const {
    donate,
    donateIsLoading,
    donateError,
    donateTxHash,
    donateIsSuccess,
  } = useContract();
  const { address, ens, ensSettled, minifiedAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();
  const chainId = useChainId();
  const etherscanUrl = `https://sepolia.etherscan.io/tx/${donateTxHash}`;
  const openEtherscanUrl = () => {
    window.open(etherscanUrl, "_blank");
  };

  function submit() {
    validate();
    if (value) {
      donate(BigInt(1));
    }
  }

  useEffect(() => {
    if (!address) {
      setStep(Step.Connect);
      return;
    }
    if (donateIsLoading && !donateTxHash) {
      setStep(Step.Confirm);
      return;
    }
    if (donateIsLoading && donateTxHash) {
      setStep(Step.Loading);
      return;
    }
    if (donateIsSuccess) {
      setStep(Step.Success);
      return;
    }
    if (donateError) {
      setStep(Step.Error);
      return;
    }
    if (address && chainId !== CHAIN_ID) {
      setStep(Step.Switch);
      return;
    }
    if (address) {
      setStep(Step.Donate);
      return;
    }
  }, [
    address,
    chainId,
    donateError,
    donateIsLoading,
    donateIsSuccess,
    donateTxHash,
  ]);

  return (
    <div className={classes.container}>
      {step === Step.Connect && (
        <>
          <Title>
            Donators
            <br />
            help rollups:
          </Title>
          <Button onClick={openConnectModal}>
            Connect your wallet to donate
          </Button>
        </>
      )}

      {step === Step.Switch && (
        <>
          <Title>
            Hey {ensSettled ? (ens ? ens : minifiedAddress) : ""}
            <br />
            {"You're not on Sepolia"}
          </Title>
          <Button onClick={() => switchNetwork?.(CHAIN_ID)}>
            Switch network
          </Button>
        </>
      )}

      {step === Step.Donate && (
        <>
          <Title>
            Welcome
            {ensSettled ? (
              <div className={classes.fadeEnter}>
                {ensSettled ? (ens ? ens : minifiedAddress) : ""}
              </div>
            ) : (
              <div className={classes.placeholder} />
            )}
          </Title>
          <div className={classes.form}>
            <Input
              userInput={userInput}
              onUserInputChange={onChange}
              placeholder="0.00"
              validate={validate}
            />
            <Button disabled={Boolean(error)} onClick={submit}>
              Donate on Sepolia
            </Button>
            {error && <div className={classes.error}>{error.message}</div>}
          </div>
        </>
      )}

      {step === Step.Confirm && (
        <>
          <Title>
            Sign the transaction
            <br />
            in your wallet
          </Title>
          <div className={classes.form}>
            <Input
              userInput={userInput}
              onUserInputChange={() => {}}
              validate={() => {}}
              disabled
            />
            <Button disabled>Waiting for signature</Button>
          </div>
        </>
      )}

      {step === Step.Loading && (
        <>
          <Title>
            We are sending
            <br />
            your donation
            <Loader style={{ marginLeft: 12 }} />
          </Title>
          {donateTxHash && (
            <Button onClick={openEtherscanUrl}>
              Follow it on etherscan <ArrowTopRightIcon />
            </Button>
          )}
        </>
      )}

      {step === Step.Success && (
        <>
          <Title>
            Thank you!
            <br />
            It means so much to us
          </Title>
          {donateTxHash && (
            <Button onClick={openEtherscanUrl}>
              See your transaction on etherscan <ArrowTopRightIcon />
            </Button>
          )}
        </>
      )}
      {step === Step.Error && (
        <>
          <Title>
            Ohh no!
            <br />
            your transaction failed
          </Title>
          <div className={classes.form}>
            <Input
              userInput={userInput}
              onUserInputChange={onChange}
              placeholder="0.00"
              validate={validate}
            />
            <Button disabled={Boolean(error)} onClick={submit}>
              Try again
            </Button>
            {error && <div className={classes.error}>{error.message}</div>}
            {donateTxHash && (
              <a
                className={classes.link}
                href={etherscanUrl}
                target="_blank"
                rel="noreferrer"
              >
                or see why?
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
