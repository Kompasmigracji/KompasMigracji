class NextResponse {
  static json(payload, init) {
    return { status: init?.status ?? 200, json: async () => payload };
  }
}
module.exports = { NextResponse };
