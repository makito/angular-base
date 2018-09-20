export class DescribedValue<T> {
  constructor(
    public value: T,
    public description: string,
    public additional: string | number = ''
  ) { }
}
