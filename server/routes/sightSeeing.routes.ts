import express, { Router } from 'express';


import { getSightSeeingLocations } from '../controller/sightSeeing.controller.js';



const router: Router = express.Router();



router.post('/sightSeeing', async (req, res) => {
    try {
        const result = await getSightSeeingLocations(req, res);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
