
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.radio = function(req, res){
  res.render('radio', { title: 'Express' })
};
exports.control = function(req, res){
  if(req.params.auth='1925'){
    res.render('control', { title: 'Express' })
  }
};
