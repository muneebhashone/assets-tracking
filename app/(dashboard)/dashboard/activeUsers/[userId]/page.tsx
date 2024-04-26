"use client";
import { insertCoins } from "@/actions/insertCoins";
import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { IInsrtCoins } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const inserCoinSchema = z.object({
  credits: z.string({ required_error: "" }).min(1, { message: "atleast 1" }),
});

type paramsProps = {
  params: {
    userId: string;
  };
};
export default function Page({ params }: paramsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<IInsrtCoins>({
    resolver: zodResolver(inserCoinSchema),
  });
  const breadcrumbItems = [
    { title: "User", link: "/dashboard/user" },
    { title: "Coupens", link: "/dashboard/user/create" },
  ];

  const onSubmit = async (data: IInsrtCoins) => {
    setLoading(true);
    if (data.credits <= 0) {
      toast({
        title: "Please insert a valid amount",
        description: "Amount must be greater then 0",
        variant:"destructive"
      });
      setLoading(false);

      return;
    }
    const credits = Number(data.credits);
    try {
      const id = Number(params.userId);
      const update = await insertCoins(id, credits);
      if (!update) {
        toast({
          title: "Error",
          description: "something went wrong",
          variant: "destructive",
        });
      }
      toast({
        title: "Coupen added",
        description: update,
      });
      reset();
      setLoading(false);
    } catch (error) {
      toast({
        title: "error",
        description: "internat server error",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Coupens `}
            description="Manage employees (Server side table functionalities.)"
          />
        </div>
        <Separator />
        <h1 className="text-3xl font-bold tracking-tight">Huzaifah</h1>
        <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-[30%] my-5">
            <Input
              type="number"
              placeholder="amount"
              {...register("credits")}
            />
            <Button disabled={loading} type="submit" className="ml-10">
              submit
            </Button>
          </div>
          {errors && <p className="text-red-500">{errors?.credits?.message}</p>}
        </form>
      </div>
    </ScrollArea>
  );
}
