import { css } from "styled-components/macro";
import { Text } from "components/Typography/Text/Text";
import { GradientText } from "components/Typography/GradientText/GradientText";
import { Box } from "components/Box/Box";
import { Spinner } from "components/Spinner/Spinner.styled";
import { ReactComponent as PolkadotLogo } from "assets/icons/PolkadotLogo.svg";
import { ReactComponent as TalismanLogo } from "assets/icons/TalismanLogo.svg";

export function WalletConfirmPendingSection(props: {
  provider: "talisman" | "polkadot-js";
}) {
  return (
    <Box flex align="center" column>
      <Box
        css={css`
          display: grid;
          grid-template-columns: 1fr;

          align-items: center;
          justify-items: center;

          > * {
            grid-column: 1;
            grid-row: 1;
          }
        `}
      >
        <Spinner css={{ width: 80, height: 80 }} />

        {props.provider === "polkadot-js" && (
          <PolkadotLogo width={48} height={48} />
        )}
        {props.provider === "talisman" && (
          <TalismanLogo width={48} height={48} />
        )}
      </Box>
      <GradientText mt={20} fs={24} fw={600} tAlign="center">
        Waiting for Authorization
      </GradientText>
      <Box pl={20} pr={20} mt={20} mb={40}>
        <Text tAlign="center" fs={16} color="neutralGray200" fw={400} lh={22}>
          Please sign into PolkadotJS Wallet Extension to connect to Basilisk
        </Text>
      </Box>
    </Box>
  );
}
