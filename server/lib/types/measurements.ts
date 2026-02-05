export interface Measurement {
  measurementId: number;
  fighterId: number;
  height: number;
  weight: number;
  dateRecorded: string;
}

export interface NewMeasurement {
  fighterId: number;
  height: number;
  weight: number;
  dateRecorded: string;
}
