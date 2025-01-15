export class ParticipantsWithSameId extends Error {
  constructor() {
    super('All participants have the same ID, which is not allowed.')
  }
}
