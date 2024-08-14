import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IReactFormProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  websiteUrl: string;
  spcontext: WebPartContext
}
