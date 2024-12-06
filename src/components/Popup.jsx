import { Button } from '@mui/material';
import React from 'react'

function Popup({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-cream px-6 py-2 rounded-lg shadow-lg text-center">
                <p className="mb-4 text-beige text-2xl">{message}</p>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={onClose}
                    sx={{ flexGrow: 1, marginRight: 1 }}
                >
                    ОК
                </Button>
            </div>
        </div>
    );
}

export default Popup