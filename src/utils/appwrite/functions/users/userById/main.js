export default async ({ req, res, log, error }) => {
    log("Hello World")
    console.log("Hello World")
    req.body = JSON.parse(req.body)
    return res.json({
        message: "success",
        info: req.body,
        errors: null
    })
}