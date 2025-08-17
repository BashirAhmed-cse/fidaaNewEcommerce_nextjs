import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { UseFormReturnType } from "@mantine/form";

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  city: string;
  zipCode: string;
  address1: string;
  address2: string;
  country: string;
}

interface DeliveryAddressFormProps {
  form: UseFormReturnType<FormValues>;
}

const FormField: React.FC<{
  id: string;
  label: string;
  placeholder: string;
  form: UseFormReturnType<FormValues>;
  name: keyof FormValues;
  required?: boolean;
  type?: string;
}> = ({ id, label, placeholder, form, name, required = true, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      {...form.getInputProps(name)}
      aria-required={required}
      aria-invalid={form.errors[name] ? "true" : "false"}
    />
    {form.errors[name] && (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {form.errors[name]}
      </p>
    )}
  </div>
);

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ form }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="First Name"
          form={form}
          name="firstName"
        />
        <FormField
          id="lastName"
          label="Last Name"
          placeholder="Last Name"
          form={form}
          name="lastName"
        />
      </div>

      <FormField
        id="phone"
        label="Phone Number"
        placeholder="Phone Number"
        form={form}
        name="phoneNumber"
        type="tel"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="state"
          label="State/Province"
          placeholder="State/Province"
          form={form}
          name="state"
        />
        <FormField
          id="city"
          label="City"
          placeholder="City"
          form={form}
          name="city"
        />
      </div>

      <FormField
        id="zipCode"
        label="Zip Code / Postal Code"
        placeholder="Zip Code"
        form={form}
        name="zipCode"
      />

      <FormField
        id="address1"
        label="Address Line 1"
        placeholder="Street address, P.O. box"
        form={form}
        name="address1"
      />

      <FormField
        id="address2"
        label="Address Line 2"
        placeholder="Apartment, suite, unit, building, floor, etc."
        form={form}
        name="address2"
        required={false}
      />

      <FormField
        id="country"
        label="Country"
        placeholder="Country"
        form={form}
        name="country"
      />

      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={form.submitting}
        aria-disabled={form.submitting}
      >
        {form.submitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Save Address"
        )}
      </Button>
    </div>
  );
};

export default DeliveryAddressForm;