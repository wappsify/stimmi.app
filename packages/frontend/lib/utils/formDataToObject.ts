export const formDataToObject = (
  formData: FormData,
): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    const keys = key.split(/[[\]]/).filter(Boolean);
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
