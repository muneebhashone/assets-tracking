"use client";

import React, { useState } from "react";
import { ModalCustom } from "./ModalComponent";
import { Button } from "./ui/button";

const Filter = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Click here</Button>
      <ModalCustom isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div>Filter</div>
      </ModalCustom>
    </>
  );
};

export default Filter;
