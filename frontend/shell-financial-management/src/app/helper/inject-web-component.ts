import { environment } from "src/environments/environment";

export const injectWebComponent = () => {
  environment?.webComponents?.forEach((url: string) => {
    const script = document.createElement("script");
    script.src = url;
    document.querySelector("body")?.appendChild(script);
    
    // Posteriormente definir el tag del web component
  });
};
