export const downloadFile = ({
  payload,
  filename,
}: {
  payload: Blob;
  filename: string;
}) => {
  const url = window.URL.createObjectURL(payload);

  const a = document.createElement("a");
  a.style.setProperty("display", "none");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
