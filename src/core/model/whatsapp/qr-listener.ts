export interface QrListener {
    onQr(qr: string, client: string): void
}