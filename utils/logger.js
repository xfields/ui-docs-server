let seq = 0
export function logVisit(ctx, method) {
  console.log(`[${seq++}][${(new Date()).toLocaleString()}][${ctx.request.ip}]${method}`);
}
