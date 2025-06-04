function errorHandler(err, req, res, next) {
    console.error(`Erro: ${err.message}`);
    console.error(`teste middleware error`);
    console.error(err.stack);

    res.status(500).json({
        message: 'Erro interno no servidor',
        error: err.message
    });
}

module.exports = errorHandler;