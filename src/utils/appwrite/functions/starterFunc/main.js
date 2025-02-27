//context arg concsists of all data passed to the function
//we can also destucture the context object to get the req and res objects
// export default async ({ req, res, log, error }) => {
export default async (context) => {
    context.log("Hello World")
    context.req.body = JSON.parse(req.body)
    return context.res.json({
        message: "success",
        info: req.body,
        errors: null
    })
}