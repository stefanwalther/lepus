class Validations {

  /**
   * ConnectionDef can be either a string or based on the schema.
   * @param connectionDef
   */
  static validateConnectionDef(connectionDef) {

    if (typeof connectionDef === 'string') {
      return null;
    }
    //
    // const schema = Joi.object().keys({
    //   server: Joi.string().required(),
    //   retry_behavior: {
    //     enabled: Joi.boolean().required(),
    //     attempts: Joi.number().required(),
    //     retries: Joi.number().required(),
    //     interval: Joi.number().required()
    //   }
    // });
    // return Joi.validate(opts, schema);
  }

}

module.export = Validations;
