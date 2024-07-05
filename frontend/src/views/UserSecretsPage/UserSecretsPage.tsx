import { useRef, useState } from "react";
import { faArrowDown, faArrowUp, faFolderBlank, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, EmptyState, IconButton, Table, TableContainer, TableSkeleton, TBody, Td, Th, THead, Tr } from "@app/components/v2";
import { usePopUp } from "@app/hooks";
import { useGetUserSecrets } from "@app/hooks/api/userSecrets/queries";

import { CreateUserSecretForm } from "./components/CreateUserSecretForm";

export const UserSecretsPage = () => {
  const parentTableRef = useRef<HTMLTableElement>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  // const [searchFilter, setSearchFilter] = useState("");

  const { handlePopUpOpen, handlePopUpToggle, handlePopUpClose, popUp } = usePopUp([
    "createSecret"
  ] as const);

  const result = useGetUserSecrets();
  const userSecrets = result.data;

  const isTableLoading = result?.isLoading;
  const isTableEmpty = userSecrets?.length === 0;

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
        <div className="thin-scrollbar mt-4" ref={parentTableRef}>
          <TableContainer className="max-h-[calc(100vh-250px)] overflow-y-auto">
            <Table>
              <THead>
                <Tr className="sticky top-0 z-20 border-0">
                  <Th>
                    <div>
                      Name
                      <IconButton
                        variant="plain"
                        className="ml-2"
                        ariaLabel="sort"
                        onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
                      >
                        <FontAwesomeIcon icon={sortDir === "asc" ? faArrowDown : faArrowUp} />
                      </IconButton>
                    </div>
                  </Th>
                  <Th>Username</Th>
                  <Th>Password</Th>
                  <Th>Website</Th>
                </Tr>
              </THead>
              <TBody>
                {isTableLoading && (
                  <TableSkeleton
                    columns={4}
                    innerKey="secret-overview-loading"
                    rows={5}
                    className="bg-mineshaft-700"
                  />
                )}
                {isTableEmpty && !isTableLoading && (
                  <Tr>
                    <Td colSpan={2}>
                      <EmptyState
                        title={"add secret"
                          // searchFilter
                          //   ? "No secret found for your search, add one now"
                          //   : "Let's add some secrets"
                        }
                        icon={faFolderBlank}
                        iconSize="3x"
                      >
                        <Button
                          className="mt-4"
                          variant="outline_bg"
                          colorSchema="primary"
                          size="md"
                          onClick={() => handlePopUpOpen("createSecret")}
                        >
                          Add Secret
                        </Button>
                      </EmptyState>
                    </Td>
                  </Tr>
                )}
                {
                userSecrets?.map(({ name, username, password, website }) => (
                  <Tr key={`${name}`}>
                    <Td>{name}</Td>
                    <Td>{username}</Td>
                    <Td>{password}</Td>
                    <Td>{website}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </TableContainer>
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
