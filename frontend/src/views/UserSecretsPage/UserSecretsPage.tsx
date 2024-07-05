import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@app/components/v2";
import { usePopUp } from "@app/hooks";

import { CreateUserSecretForm } from "./components/CreateUserSecretForm";

export const UserSecretsPage = () => {
  const { handlePopUpOpen, handlePopUpToggle, handlePopUpClose, popUp } = usePopUp([
    "createSecret"
  ] as const);

  return (
    <>
      <div className="container mx-auto px-6 text-mineshaft-50 dark:[color-scheme:dark]">
        <div className="space-y-8">
          <div className="mt-6">
            <p className="text-3xl font-semibold text-bunker-100">User Secrets</p>
          </div>
        </div>
        <div className="flex flex-row items-end justify-end space-x-2">
          <Button
            variant="outline_bg"
            leftIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => handlePopUpOpen("createSecret")}
            className="h-10"
          >
            Add Secret
          </Button>
        </div>
      </div>
      <CreateUserSecretForm
        isOpen={popUp.createSecret.isOpen}
        onTogglePopUp={(isOpen) => handlePopUpToggle("createSecret", isOpen)}
        onClose={() => handlePopUpClose("createSecret")}
      />
    </>
  );
};
