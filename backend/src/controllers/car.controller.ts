import { Request, Response } from "express";
import Car from "../models/Car.model";
import { success, error } from "../utils/apiResponse";

export const getCars = async (req: Request, res: Response) => {
  try {
    const {
      search,
      brand,
      fuelType,
      transmission,
      drivetrain,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      minHorsepower,
      maxHorsepower,
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (search) filter.$text = { $search: search as string };
    if (brand) filter.brand = brand;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (drivetrain) filter.drivetrain = drivetrain;
    if (minYear || maxYear)
      filter.year = {
        ...(minYear && { $gte: Number(minYear) }),
        ...(maxYear && { $lte: Number(maxYear) }),
      };
    if (minPrice || maxPrice)
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    if (minHorsepower || maxHorsepower)
      filter.horsepower = {
        ...(minHorsepower && { $gte: Number(minHorsepower) }),
        ...(maxHorsepower && { $lte: Number(maxHorsepower) }),
      };

    const sortOrder = order === "desc" ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort({ [sortBy as string]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Car.countDocuments(filter),
    ]);

    return success(res, {
      cars,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error('Erro getCars:', err);
    return error(res, 'Erro ao buscar carros', 500);
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return error(res, "Carro não encontrado", 404);
    return success(res, car);
  } catch {
    return error(res, "Erro ao buscar carro", 500);
  }
};

export const compareCars = async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string)?.split(",");
    if (!ids || ids.length < 2)
      return error(res, "Informe ao menos 2 IDs para comparação", 400);

    const cars = await Car.find({ _id: { $in: ids } });
    return success(res, cars);
  } catch {
    return error(res, "Erro ao comparar carros", 500);
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.create(req.body);
    return success(res, car, 201);
  } catch (err) {
    return error(res, "Erro ao criar carro", 500);
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) return error(res, "Carro não encontrado", 404);
    return success(res, car);
  } catch {
    return error(res, "Erro ao atualizar carro", 500);
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return error(res, "Carro não encontrado", 404);
    return success(res, { message: "Carro removido com sucesso" });
  } catch {
    return error(res, "Erro ao remover carro", 500);
  }
};
