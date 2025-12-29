export function withAuth(handler) {
    return (req, res, next) => {
        return handler(req, res, next);
    };
}
// handler è una funzione (il mio controller) che si aspetta:
// req di tipo AuthRequest, res e next
// il tipo di ritorno di handler è any (puo restituire qualsiasi cosa)
