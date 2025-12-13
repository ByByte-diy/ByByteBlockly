/**
 * Модель плати (Arduino, ESP32, etc.)
 */
export interface IBoard {
  id: string;
  name: string;
  fqbn: string; // Fully Qualified Board Name для arduino-cli
  core?: string;
  programmer?: string;
  uploadSpeed?: number;
}