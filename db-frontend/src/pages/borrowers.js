import React, { useState } from "react";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import { toast } from "react-toastify";

export default function Borrowers() {
  const [formData, setFormData] = useState({});
  const onSubmitForm = e => {
    e.preventDefault();
    createBorrower();
  };

  const createBorrower = () => {
    fetch("http://localhost:3000/borrower/new", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(json => toast.info(json.message))
      .catch(error => {
        console.log(error.message);
        toast.info(error.message);
      });
  };

  return (
    <div style={{ padding: 16, margin: 0 }}>
      <h1>Create Borrower</h1>

      <form onSubmit={onSubmitForm}>
        <FormControl
          style={{ display: "block", marginBottom: 16 }}
          required
          onSubmit={onSubmitForm}
        >
          <InputLabel>Name</InputLabel>
          <Input
            value={formData.name || ""}
            onChange={e => {
              formData.name = e.target.value;
              setFormData(JSON.parse(JSON.stringify(formData)));
            }}
          />
        </FormControl>

        <FormControl
          style={{ display: "block", marginBottom: 16 }}
          required
          onSubmit={onSubmitForm}
        >
          <InputLabel>Address</InputLabel>
          <Input
            value={formData.address || ""}
            onChange={e => {
              formData.address = e.target.value;
              setFormData(JSON.parse(JSON.stringify(formData)));
            }}
          />
        </FormControl>

        <FormControl
          style={{ display: "block", marginBottom: 16 }}
          required
          onSubmit={onSubmitForm}
        >
          <InputLabel>Phone</InputLabel>
          <Input
            maxlength="8"
            type="number"
            value={formData.phone || ""}
            onChange={e => {
              formData.phone = e.target.value.slice(0, 8);
              setFormData(JSON.parse(JSON.stringify(formData)));
            }}
          />
        </FormControl>

        <FormControl
          style={{ display: "block", marginBottom: 16 }}
          required
          onSubmit={onSubmitForm}
        >
          <InputLabel>SSN</InputLabel>
          <Input
            value={formData.ssn || ""}
            onChange={e => {
              formData.ssn = e.target.value;
              setFormData(JSON.parse(JSON.stringify(formData)));
            }}
          />
        </FormControl>

        <Button
          style={{ marginTop: 32 }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
