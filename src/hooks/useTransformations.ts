import { useEffect, useState } from 'react';

export type Transformation = {
  id: string;
};

export function useTransformations() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  useEffect(() => {
    setTransformations([]);
  }, []);

  return { transformations };
}
