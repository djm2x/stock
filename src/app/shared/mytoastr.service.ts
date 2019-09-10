import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MyToastrService {
  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  };

  myConfig = {
    positionClass: 'toast-bottom-left',
    closeButton: true,
    disableTimeOut: false,
    tapToDismiss: false,
    preventDuplicates: false,
  };

  constructor(private toastr: ToastrService) { }

  public toastError = (msg, description) => this.toastr.error(msg, description, this.myConfig);
  public toastSuccess = (msg, description) => this.toastr.success(msg, description, this.myConfig);

  toastNotif(o: any) {
    switch (o.color) {
      case 1:
        return this.toastr.info('Sortie', o.msg, this.myConfig);
      case 2:
        return this.toastr.success('Entree', o.msg, this.myConfig);
      case 3:
        return this.toastr.warning('Warning', o.msg, this.myConfig);
      default:
        return this.toastr.error('Danger', o.msg, this.myConfig);
    }
  }

  // toastInfo = (title, msg) => {
  //   return this.toastr.info(msg, title, {

  //   }); // .onAction.subscribe(r => console.log(r));
  // }

  // toastWarning = (title, msg) => {
  //   var t = this.toastr.warning(msg, title, {
  //     positionClass: 'toast-bottom-left',
  //     closeButton: true,
  //     disableTimeOut: true,
  //     tapToDismiss: false,
  //     // preventDuplicates = false;
  //   }).onAction.subscribe(r => console.log(r));

  // }
}
