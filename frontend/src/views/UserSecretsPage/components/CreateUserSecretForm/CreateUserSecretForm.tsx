import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalContent,
} from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";
import { useCreateUserSecretV3 } from "@app/hooks/api";

const typeSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    website: z.string().min(1, "Website is required"),
  })
  .refine((data) => data.name !== undefined, {
    message: "Please enter secret name"
  });

type TFormSchema = z.infer<typeof typeSchema>;

type Props = {
  // modal props
  isOpen?: boolean;
  onClose: () => void;
  onTogglePopUp: (isOpen: boolean) => void;
};

export const CreateUserSecretForm = ({
  isOpen,
  onClose,
  onTogglePopUp,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<TFormSchema>({ resolver: zodResolver(typeSchema) });

  const { mutateAsync: createUserSecretV3 } = useCreateUserSecretV3();

  const handleFormSubmit = async ({ name, username, password, website }: TFormSchema) => {
    try {
      await createUserSecretV3({
        name,
        username,
        password,
        website
      });
      onClose();
      reset();
      createNotification({
        type: "success",
        text: "Successfully created secret"
      });
    } catch (error) {
      console.log(error);
      createNotification({
        type: "error",
        text: "Failed to create secret"
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onTogglePopUp}>
      <ModalContent
        className="max-h-[80vh] overflow-y-auto"
        title="Create a new User Secret"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl label="Name" isError={Boolean(errors?.name)} errorText={errors?.name?.message}>
            <Input
              {...register("name")}
              placeholder="Login"
            />
          </FormControl>
          <FormControl label="Username" isError={Boolean(errors?.username)} errorText={errors?.username?.message}>
            <Input
              {...register("username")}
              placeholder="Username"
            />
          </FormControl>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl
                label="Password"
                isError={Boolean(errors?.password)}
                errorText={errors?.password?.message}
              >
                <InfisicalSecretInput
                  {...field}
                  containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                />
              </FormControl>
            )}
          />
          <FormControl label="Website" isError={Boolean(errors?.website)} errorText={errors?.website?.message}>
            <Input
              {...register("website")}
              placeholder="https://example.com"
            />
          </FormControl>
          <div className="mt-7 flex items-center">
            <Button
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              key="layout-create-project-submit"
              className="mr-4"
              type="submit"
            >
              Create Secret
            </Button>
            <Button
              key="layout-cancel-create-project"
              onClick={onClose}
              variant="plain"
              colorSchema="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
