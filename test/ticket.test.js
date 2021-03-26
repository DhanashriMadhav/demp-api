const router=require("../route/ticket.js")
it("get open ticket",() => {
    const request= router.get("busNumber")
    const response=  router.get("closed/:busNumber") 
    expect(request).toBe(response);
});