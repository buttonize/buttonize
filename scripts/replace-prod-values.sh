echo "export const iacTopicArn = 'arn:aws:sns:us-west-2:081205402391:buttonize-public-iac-topic'" > cdk/custom-resources/handler/iac-topic-arn.ts && \
echo "export const buttonizeAccountPrincipalId = '081205402391'" > cdk/utils/buttonize-account-principal.ts
