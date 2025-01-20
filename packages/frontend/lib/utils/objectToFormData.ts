export const objectToFormData = (obj: Record<string, unknown>): FormData => {
  const formData = new FormData();
  const appendFormData = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((item: object, index) => {
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
