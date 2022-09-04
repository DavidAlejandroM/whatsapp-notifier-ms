export interface MessageMedia {
    mimetype: string
    /** Base64-encoded data of the file */
    data: string
    /** Document file name. Value can be null */
    filename?: string | null
}