import {Request, Response, Router} from "express";
import {UserService} from "../services/UserService";
import {UserSchema} from "../types";

const router = Router();

router.get('/', (req: Request, res: Response) => {

    res.json({
        status: 'OK'
    });
});

router.post('/register', (req: Request, res: Response) => {

    const params = req.params as { username: string, password: string };

    if (params.username && params.password) {
        UserService.createUserWithPassword(params.username, params.password).then((user: UserSchema) => {

            res.status(200).json({
                message: 'User created successfully'
            });
        }).catch((err: Error) => {

            res.status(400).json({
                error: err?.message || err
            });
        });

    } else {

        res.status(400).json({
            error: 'Missing username or password'
        });
    }

});

router.post('/login', (req: Request, res: Response) => {

    const params = req.params as { username: string, password: string };

    if (params.username && params.password) {

        UserService.findByCredentials(params.username, params.password).then((user: UserSchema) => {

            if (user) {
                res.status(200).json({
                    message: 'Success',
                    username: user.username,
                    authToken: user.authToken
                });
            } else {
                res.status(400).json({
                    error: 'Login failed'
                });
            }

        }).catch((err: Error) => {

            res.status(400).json({
                error: err?.message || err
            });
        });

    } else {

        res.status(400).json({
            error: 'Missing username or password'
        });
    }

});


export const authRouter: Router = router;