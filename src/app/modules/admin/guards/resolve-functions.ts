import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { AdminPagesService } from '../services/admin-pages.service';

import { AdminDataGeneric, listTypes } from '../models/generic-admin-data.model';

export const adminPagesResolver: ResolveFn<AdminDataGeneric<listTypes[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // We are getting id from data where resolver function added to route. Please add yours, too!
  const id = route.data['id'];
  const urlSegments = route.url;
  const firstSegment = urlSegments[0].path;

  return inject(AdminPagesService).getItem<AdminDataGeneric<listTypes[]>>(id, firstSegment);
};
