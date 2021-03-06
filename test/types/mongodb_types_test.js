'use strict';

var expect = require('chai').expect,
    fail = expect.fail,
    MongoDBTypes = require('../../lib/types/mongodb_types');

var mongoDBTypes;

describe('MongoDBTypes', () => {
  before(() => {
    mongoDBTypes = new MongoDBTypes();
  });

  describe('#getTypes', () => {
    it('only returns the supported type list', () => {
      var types = mongoDBTypes.getTypes();
      expect(types).to.deep.have.members(
        [
          'String',
          'Integer',
          'Long',
          'BigDecimal',
          'LocalDate',
          'ZonedDateTime',
          'Boolean',
          'Enum',
          'Blob',
          'AnyBlob',
          'ImageBlob',
          'TextBlob',
          'Float',
          'Double'
        ]
      );
    });
  });

  describe('#getValidationsForType', () => {
    describe('when passing a valid type', () => {
      it('returns only the validation list for it', () => {
        var validations = mongoDBTypes.getValidationsForType('String');
        expect(validations).to.deep.have.members(
          [
            'required',
            'minlength',
            'maxlength',
            'pattern'
          ]
        );
      });
    });

    describe('when passing an invalid type', () => {
      describe('because it is null', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.getValidationsForType(null);
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because it is blank', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.getValidationsForType('');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because it does not exist', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.getValidationsForType('NoTypeAtAll');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });
    });
  });

  describe('#toValueNameObjectArray', () => {
    it('correctly transposes the type list into a name/value object array', () => {
      expect(mongoDBTypes.toValueNameObjectArray()).to.deep.have.members(
        [
          {
            value: 'String',
            name: 'String'
          },
          {
            value: 'Integer',
            name: 'Integer'
          },
          {
            value: 'Long',
            name: 'Long'
          },
          {
            value: 'BigDecimal',
            name: 'BigDecimal'
          },
          {
            value: 'LocalDate',
            name: 'LocalDate'
          },
          {
            value: 'ZonedDateTime',
            name: 'ZonedDateTime'
          },
          {
            value: 'Boolean',
            name: 'Boolean'
          },
          {
            value: 'Enum',
            name: 'Enum'
          },
          {
            value: 'Blob',
            name: 'Blob'
          },
          {
            value: 'AnyBlob',
            name: 'AnyBlob'
          },
          {
            value: 'ImageBlob',
            name: 'ImageBlob'
          },
          {
            value: 'TextBlob',
            name: 'TextBlob'
          },
          {
            value: 'Float',
            name: 'Float'
          },
          {
            value: 'Double',
            name: 'Double'
          }
        ]
      );
    });
  });

  describe('#contains', () => {
    describe('when passing a contained type', () => {
      it('returns true', () => {
        expect(mongoDBTypes.contains('String')).to.be.true;
      });
    });

    describe('when passing a not contained type', () => {
      describe('that is null', () => {
        it('returns false', () => {
          expect(mongoDBTypes.contains(null)).to.be.false;
        });
      });

      describe('that is blank', () => {
        it('returns false', () => {
          expect(mongoDBTypes.contains('')).to.be.false;
        });
      });

      describe('that has a valid name, but is not contained', () => {
        it('returns false', () => {
          expect(mongoDBTypes.contains('NoTypeAtAll')).to.be.false;
        });
      });
    });
  });

  describe('#isValidationSupportedForType', () => {
    describe('when the passed types and validation exist', () => {
      it('returns true', () => {
        expect(
          mongoDBTypes.isValidationSupportedForType('String', 'required')
        ).to.be.true;
      });
    });

    describe('when the passed type is invalid', () => {
      describe('because it is null', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType(null, 'required');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because it is blank', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType('', 'required');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because it does not exist', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType(
              'NoTypeAtAll',
              'required');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });
    });

    describe('when the passed validation is invalid', () => {
      describe('because it is null', () => {
        it('returns false', () => {
          expect(
            mongoDBTypes.isValidationSupportedForType('String', null)
          ).to.be.false;
        });
      });

      describe('because it is blank', () => {
        it('returns false', () => {
          expect(
            mongoDBTypes.isValidationSupportedForType('String', '')
          ).to.be.false;
        });
      });

      describe('because it does not exist', () => {
        it('returns false', () => {
          expect(
            mongoDBTypes.isValidationSupportedForType(
              'String',
              'NoValidationAtAll')
          ).to.be.false;
        });
      });
    });

    describe('when both the passed type and validation are invalid', () => {
      describe('because they are null', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType(null, null);
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because they are blank', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType('', '');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });

      describe('because they do not exist', () => {
        it('throws an exception', () => {
          try {
            mongoDBTypes.isValidationSupportedForType(
              'NoTypeAtAll',
              'NoValidation');
            fail();
          } catch (error) {
            expect(error.name).to.equal('WrongDatabaseTypeException');
          }
        });
      });
    });
  });
});
