export interface IButton {
  label: string;
  width?: number;
  height?: number;
  onClick: () => void;
  fontSize?: number;
  backgroundColor?: number;
  radius?: number;
  textColor?: number;
}
