export interface JIFThrow {
  time: number;
  duration: number;
  from: number;
  to: number;
  label?: string;
  prop?: number;
}

export interface JIFLimb {
  juggler: number;
  type: string;
}

export interface JIFJuggler {
  name: string;
  position: number[];
  lookAt: number[];
}

export interface JIFProp {
  color: string;
  type: string;
}

export interface JIF {
  meta?: {
    name?: string;
    type?: string;
    description?: string;
    generator?: string;
    version?: string;
  };
  timeStretchFactor: number;
  jugglers: JIFJuggler[];
  limbs: JIFLimb[];
  props: JIFProp[];
  throws: JIFThrow[];
  repetition: {
    period?: number;
    limbPermutation?: number[];
  };
}
