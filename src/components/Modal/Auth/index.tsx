import React, { useEffect } from "react";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { userState } from "../../../atoms/userAtom";
import { auth } from "../../../firebase/clientApp";
import AuthInputs from "./Inputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";
import ModalWrapper, { ModalWrapperProps } from "../ModalWrapper";

interface AuthModalProps extends ModalWrapperProps {

  children: React.ReactNode;
  
}

const AuthModal: React.FC<AuthModalProps> = ({ children, isOpen, onClose, ...props }) => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

  const currentUser = useRecoilValue(userState);
  const [user, error] = useAuthState(auth);

  const toggleView = (view: string) => {
    setModalState({
      ...modalState,
      view: view as typeof modalState.view,
    });
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader display="flex" flexDirection="column" alignItems="center">
        {modalState.view === "login" && "Login"}
        {modalState.view === "signup" && "Sign Up"}
        {modalState.view === "resetPassword" && "Reset Password"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pb={6}
      >
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          width="70%"
        >
          {modalState.view === "login" || modalState.view === "signup" ? (
            <>
              <OAuthButtons />
              OR
              <AuthInputs toggleView={toggleView} />
            </>
          ) : (
            <ResetPassword toggleView={toggleView} />
          )}
         
          {user && !currentUser && (
            <>
              <Spinner size="lg" mt={2} mb={2} />
              <Text fontSize="8pt" textAlign="center" color="blue.500">
                You are logged in. You will be redirected soon
              </Text>
            </>
          )}
          {!false ? (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
            </Flex>
          ) : null}
        </Flex>
      </ModalBody>
    </ModalWrapper>
  );
};
export default AuthModal;
