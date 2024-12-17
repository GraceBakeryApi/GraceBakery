import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import i18next from 'i18next';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function LangSwitch() {
    const [language, setLanguage] = useState(i18next.language || 'de');

    const handleSwitchChange = (event) => {
        const newLanguage = event.target.checked ? 'ru' : 'de';
        setLanguage(newLanguage);
        i18next.changeLanguage(newLanguage);
    };

    const LanguageSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#C9A97F'
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: '#A2845E',
            boxSizing: 'border-box'
        },
    }));

    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography>De</Typography>
            <LanguageSwitch
                checked={language === 'ru'}
                onChange={handleSwitchChange}
                aria-label="language switch"
            />
            <Typography>Ru</Typography>
        </Stack>
    );
}

export default LangSwitch;
