


export const home = (req, res) => {
    res.render('index', {displayName: req.displayName});
}
