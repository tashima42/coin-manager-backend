import {Request, Response} from "express";
import {IAuthenticateUserRequestDTO} from "./register-user-request-DTO";
import {IAuthenticateUserResponseDTO} from "./register-user-response-DTO";
import {AuthenticateUserUseCase} from "./register-user-use-case";

export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(request: Request, response: Response): Promise<unknown> {
    const {username, password}: IAuthenticateUserRequestDTO = request.body

    try {
      const token = await this.authenticateUserUseCase.execute({
        username,
        password,
      })
      const authenticationToken: IAuthenticateUserResponseDTO = {
        type: "Bearer",
        token
      }
      return response.status(200).json(authenticationToken)
    } catch (error: any) {
      console.error(error)
      if (error.code === "UC-AU-001")
        return response.status(404).json({success: false, message: error.message})
      if (error.code === "UC-AU-002")
        return response.status(401).json({success: false, message: error.message})

      return response.status(500).json({success: false, message: "Unexpected error, contact the developers", stack: error.stack})
    }
  }
}
