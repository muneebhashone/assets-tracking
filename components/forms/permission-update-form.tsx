import useQueryUpdater from "@/hooks/useQueryUpdater";
import { useCurrentUser } from "@/services/auth.mutations";
import { useUpdatePermissions } from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { PermissionsForDisplay } from "@/utils/constants";
import { checkPermissions } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "../ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { MultiSelect } from "../ui/multi-select";
import { toast } from "../ui/use-toast";
interface PermissionUpdateProps {
  row: User;
}
type UpdatePermissionsInputType = z.infer<typeof permissionUpdateZod>;
const permissionUpdateZod = z.object({
  permissions: z
    .string({ required_error: "Invalid permissions." })
    .array()
    .min(1, { message: "Atleast one permission is required." }),
});

const PermissionUpdate = (props: PermissionUpdateProps) => {
  const { row } = props;
  const searchParams = useSearchParams();
  const permissions = searchParams.getAll("pe");
  const { querySetter } = useQueryUpdater();
  const form = useForm<UpdatePermissionsInputType>({
    resolver: zodResolver(permissionUpdateZod),
    values: {
      permissions: row?.permissions,
    },
  });
  const { control, handleSubmit } = form;
  const { mutate } = useUpdatePermissions({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });

      querySetter("pe", `${row.id}`);
    },
    onError(error, variables, context) {
      if (error instanceof Error) {
        toast({
          title: error?.response?.data.message,
          duration: 2000,
          variant: "destructive",
        });
      }
    },
  });
  const { data: currentUser } = useCurrentUser();
  const permissionsEntry = currentUser?.user.permissions.reduce(
    (acc: Record<string, string>[], curr) => {
      acc.push({ label: PermissionsForDisplay[curr], value: curr });
      return acc;
    },
    [],
  );

  const onSubmit = (data: UpdatePermissionsInputType) => {
    mutate({ id: row.id, ...data });
  };

  const updateCondition =
    currentUser?.user.role === "SUPER_ADMIN" ||
    checkPermissions(currentUser?.user.permissions as PermissionsType[], [
      "UPDATE_PERMISSIONS",
    ]);
  return (
    <div className="permission-access">
      {permissions?.includes(String(row?.id)) && updateCondition ? (
        <Form {...form}>
          <form>
            <FormField
              name="permissions"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={permissionsEntry as Record<string, string>[]}
                      onValueChange={field.onChange}
                      defaultValue={field.value as string[]}
                      className="bg-green-600 text-xs text-white px-2 py-1 m-0.5 "
                      placeholder="Select permissions"
                      variant="inverted"
                      check={true}
                      handleSubmit={handleSubmit(onSubmit)}
                      animation={2}
                      maxCount={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        row?.permissions.map((permission, index) => (
          <Badge
            key={index}
            className="bg-green-600 text-xs text-white px-2 py-1 m-0.5"
          >
            {PermissionsForDisplay[permission]}
          </Badge>
        ))
      )}
    </div>
  );
};

export default PermissionUpdate;
