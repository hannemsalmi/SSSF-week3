// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat

import {Cat} from '../../interfaces/Cat';
import catModel from '../models/catModel';
import rectangleBounds from '../../utils/rectangleBounds';

export default {
  Query: {
    cats: async () => {
      return await catModel.find();
    },
    catById: async (_parent: undefined, args: {id: string}) => {
      return await catModel.findById(args.id);
    },
    catsByOwner: async (_parent: undefined, args: {ownerId: String}) => {
      return await catModel.find({owner: args.ownerId});
    },

    catsByArea: async (
      _parent: undefined,
      args: {
        topRight: {type: string; lat: number; lng: number};
        bottomLeft: {type: string; lat: number; lng: number};
      }
    ) => {
      const topRight = {
        lat: args.topRight.lat,
        lng: args.topRight.lng,
      };
      const bottomLeft = {
        lat: args.bottomLeft.lat,
        lng: args.bottomLeft.lng,
      };
      console.log(topRight, bottomLeft);

      const polygonCoordinates = rectangleBounds(topRight, bottomLeft);
      return await catModel.find({
        location: {
          $geoWithin: {
            $geometry: polygonCoordinates,
          },
        },
      });
    },
  },

  Mutation: {
    createCat: async (_parent: undefined, args: Cat) => {
      console.log(args);
      const cat = new catModel(args);
      return await cat.save();
    },
    updateCat: async (_parent: undefined, args: Cat) => {
      return await catModel.findByIdAndUpdate(args.id, args, {
        new: true,
      });
    },
    deleteCat: async (_parent: undefined, args: {id: string}) => {
      return await catModel.findByIdAndDelete(args.id);
    },
  },
};
