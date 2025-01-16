export class PermissionDeniedError extends Error {
  constructor() {
    super('You do not have permission to modify this resource.')
  }
}
