import React, { useState } from "react";
import CustomPopUp from "./components/UserProfile/CustomPopUp";
import CreateRolesForm from "./components/UserProfile/CreateRolesForm";

import logo from "./components/UserProfile/logo-no-background.png";

function CreateUPModal() {
  const buttonText = "Add Profile";

  return (
    <CustomPopUp buttonText={buttonText} variant="filled">
      <img src={logo} alt="Logo" width={400} height={130} />
      <CreateRolesForm />
    </CustomPopUp>
  );
}

export default CreateUPModal;
