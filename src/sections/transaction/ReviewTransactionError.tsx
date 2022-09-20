import { Text } from "components/Typography/Text/Text"
import { Box } from "components/Box/Box"
import { Button } from "components/Button/Button"
import { ReactComponent as FailIcon } from "assets/icons/FailIcon.svg"
import { css } from "styled-components"
import { useTranslation } from "react-i18next"

export const ReviewTransactionError = (props: {
  onClose: () => void
  onReview: () => void
}) => {
  const { t } = useTranslation()

  return (
    <Box flex align="center" column>
      <FailIcon />
      <Text color="red400" mt={20} fs={24} fw={600} tAlign="center">
        {t("pools.reviewTransaction.modal.error.title")}
      </Text>
      <Box flex column acenter pl={20} pr={20} mt={20} mb={40}>
        <Text tAlign="center" fs={16} color="neutralGray200" fw={400} lh={22}>
          {t("pools.reviewTransaction.modal.error.description")}
        </Text>

        <Box
          css={css`
            max-width: 200px;
            width: 100%;
            flex-grow: 1;

            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          `}
        >
          <Button
            variant="secondary"
            mt={40}
            onClick={props.onClose}
            css={css`
              width: 100%;
              text-align: center;
              flex-grow: 1;
            `}
          >
            {t("pools.reviewTransaction.modal.error.close")}
          </Button>

          <Text
            color="primary450"
            fw={500}
            fs={14}
            mt={10}
            css={css`
              cursor: pointer;
            `}
            onClick={props.onReview}
          >
            {t("pools.reviewTransaction.modal.error.review")}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
