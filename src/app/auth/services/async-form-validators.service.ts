import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class AsyncFormValidatorsService {
  timeout: any;
  debounceTime: number = 1000;

  constructor(
    private us: UserService
  ) { }

  usernameUnique(): ValidatorFn {
    return (c: AbstractControl): Observable<{[key: string]: any}> => {
      const username = c.value;
      // hack to achieve debounce with async form validator
      clearTimeout(this.timeout);
      return Observable.create((observer: any) => {
        this.timeout = setTimeout(() => {
          this.us.usernameIsUnique(username)
            .pipe(map(isUnique => isUnique ? null : { isNotUnique: true }))
            .subscribe(
              res => { observer.next(res); observer.complete(); }
            );
        }, this.debounceTime);
      });
    };
  }
}
