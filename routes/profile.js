var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    phone: String,
    verify: {type: String, default: '00000'}, //Код будет генерироваться при вводе номера
    password: String,
    rating: Number,
    problems: { type: Array, default: [] },
    f_name: String,
    s_name: String,
    t_name: String
});

// генерирующий хэш
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// проверка правильности пароля
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema)