import { ControlValueAccessor } from '@angular/forms';

export abstract class ValueAccessorBase<T> implements ControlValueAccessor {

  private _innerValue: T;

  private _changed = new Array<(value: T) => void>();
  private _touched = new Array<() => void>();

  get value(): T {
    return this._innerValue;
  }
  set value(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this._changed.forEach(f => f(value));
    }
  }

  writeValue(value: T) {
    this._innerValue = value;
  }

  registerOnChange(fn: (value: T) => void) {
    this._changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this._touched.push(fn);
  }

  touch() {
    this._touched.forEach(f => f());
  }

}
