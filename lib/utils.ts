import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const objectToFormData = (obj: Record<string, unknown>): FormData => {
  const formData = new FormData();
  const appendFormData = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            appendFormData(`${key}[${index}][${subKey}]`, subValue);
          });
        } else {
          formData.append(`${key}[${index}]`, item as string);
        }
      });
    } else {
      formData.append(key, value as string);
    }
  };

  Object.entries(obj).forEach(([key, value]) => appendFormData(key, value));
  return formData;
};

export const formDataToObject = (
  formData: FormData
): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    const keys = key.split(/[\[\]]/).filter(Boolean);
    keys.reduce((acc, currKey, index) => {
      if (index === keys.length - 1) {
        if (Array.isArray(acc[currKey])) {
          (acc[currKey] as unknown[]).push(value);
        } else if (acc[currKey] !== undefined) {
          acc[currKey] = [acc[currKey], value];
        } else {
          acc[currKey] = value;
        }
      } else {
        if (!acc[currKey]) {
          acc[currKey] = isNaN(Number(keys[index + 1])) ? {} : [];
        }
        return acc[currKey] as Record<string, unknown>;
      }
      return acc;
    }, obj);
  });

  return obj;
};
